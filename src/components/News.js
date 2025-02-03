import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
    static defaultProps = {
        pageSize:5,
        country:'us',
        category:'general'

    }

    static propTypes = {
        country:PropTypes.string,
        pageSize:PropTypes.number,
        category:PropTypes.string,

    }
    constructor(props) {
        super();
        this.state = {
            articles: [],
            page: 1,
            totalArticles: 0,
            loading:false
        };
    }

    async componentDidMount() {
        this.fetchNews();
    }

    fetchNews = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=aff22bdf26174435813e65348bc6c419&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true})
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({loading:false})
        this.setState({
            articles: parsedData.articles,
            totalArticles: parsedData.totalResults,
        });
    };

    handleNextClick = async () => {
        if (this.state.page < Math.ceil(this.state.totalArticles / this.props.pageSize)) {
            this.setState(
                (prevState) => ({ page: prevState.page + 1 }),
                this.fetchNews
            );
        }
    };

    handlePreviousClick = async () => {
        if (this.state.page > 1) {
            this.setState(
                (prevState) => ({ page: prevState.page - 1 }),
                this.fetchNews
            );
        }
    };

    render() {
        return (
            <div className="container my-3">
                
                <h1 className='text-center' style={{margin:'35px 0px'}}>News Monkey - Top Headlines</h1>
                {this.state.loading && <Spinner/>}
                <div className="row">
                    {!this.state.loading && this.state.articles.map((element) => {
                        return (
                            <div className="col-md-4" key={element.url}>
                                <NewsItem
                                    title={element.title ? element.title.slice(0, 45) : ''}
                                    description={element.description ? element.description.slice(0, 88) : ''}
                                    imgUrl={element.urlToImage}
                                    newsUrl={element.url}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="container d-flex justify-content-between">
                    <button
                        disabled={this.state.page <= 1}
                        type="button"
                        className="btn btn-dark"
                        onClick={this.handlePreviousClick}
                    >
                        &larr; Previous
                    </button>
                    <button
                        disabled={this.state.page >= Math.ceil(this.state.totalArticles / this.props.pageSize)}
                        type="button"
                        className="btn btn-dark"
                        onClick={this.handleNextClick}
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>
        );
    }
}

export default News;
