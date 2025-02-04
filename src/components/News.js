
import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Capitalize category for the document title
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  useEffect(() => {
    document.title = `${capitalize(props.category)} - News Monkey`;
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = async () => {
    props.setProgress(10);
    setLoading(true);
    const { country, category, pageSize } = props;

    try {
      let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}&page=${page}&pageSize=${pageSize}`;
      let response = await fetch(url);
      props.setProgress(30);
      let parsedData = await response.json();
      props.setProgress(70);
      
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      setHasMore(page * pageSize < parsedData.totalResults);
      props.setProgress(100);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchMoreData = async () => {
    if (articles.length >= totalResults) {
      setHasMore(false);
      return;
    }

    try {
      const nextPage = page + 1;
      setPage(nextPage);

      const { country, category, pageSize } = props;
      let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}&page=${nextPage}&pageSize=${pageSize}`;
      let response = await fetch(url);
      let parsedData = await response.json();

      setArticles([...articles, ...(parsedData.articles || [])]);
      setTotalResults(parsedData.totalResults);
      setHasMore(nextPage * pageSize < parsedData.totalResults);
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
        News Monkey - Top Headlines on {capitalize(props.category)}
      </h1>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Spinner />}
        endMessage={
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <b>No more news to load!</b>
          </p>
        }
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ''}
                  description={element.description ? element.description.slice(0, 88) : ''}
                  imgUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  pageSize: 5,
  country: 'us',
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;