var paging = {};
var Vime = React.createClass({

    render: function () {


        return (
            <section className="vime">
                <h1>{this.props.index +1}</h1>
                <Author className="author" user={this.props.list.user}/>
                <Blurb className="blurb" blurb={this.props.list}/>
                <Stats className="stats" stats={this.props.list.stats}
                       likes={this.props.list.metadata.connections.likes}
                       comments={this.props.list.metadata.connections.comments}/>
            </section>
        );
    }
});

var Author = React.createClass({
    render: function () {
        var imglink = this.props.user.pictures ? this.props.user.pictures.sizes[3].link : "";

        var name = this.props.user.name;
        var link = this.props.user.link;
        return (
            <div className="author">
                <img src={imglink} alt="Author"/>

                <a href={link}> {name}</a>
            </div>
        );
    }
});

var Stats = React.createClass({

    render: function () {

        var plays = this.props.stats.plays;
        var likes = this.props.likes.total;
        var comments = this.props.comments.total;
        return (
            <ul className="stats">
                <li>
                    P {plays}
                </li>
                <li>
                    L {likes}
                </li>
                <li>
                    C {comments}
                </li>
            </ul>
        );
    }
});

var Blurb = React.createClass({
    render: function () {
        var desc = this.props.blurb.description;
        var name = this.props.blurb.name;
        return (
            <div className="blurb">
                <h1><a href={this.props.blurb.link}> {name}</a></h1>
                <p>{desc}</p>

            </div>
        );
    }
});


var VimeList = React.createClass({


    componentWillReceiveProps: function(nextProps){

        var content = this.props.vimes.list ? this.props.vimes.list : new Array(50);
        var bounds = this.props.bounds;


        if (content.length > nextProps.bounds[1]){

            $(paging).trigger('true');
        }
        else
        {

            $(paging).trigger('false');
        }


    },

    render: function () {

        var content = this.props.vimes.list ? this.props.vimes.list : [];
        var bounds = this.props.bounds;
        var allLikes = this.props.allLikes;
        var substring = this.props.substring;



        var vimes = content.filter(function (e, i) {

            return i >= bounds[0] && i < bounds[1];
        }).filter(function (e) {

            if (allLikes)
                return e.user.metadata.connections.likes.total > 10;
            else
                return true;

        }).filter(function (e, i) {

            return e.description ? e.description.match(new RegExp(substring, 'i')) : true;

            // e.description ? e.description.indexOf(substring) > -1); : true;


        }).map(function (list, index) {


            return (
                <div key={list.user.uri + Math.random(10)}>
                    <Vime list={list} index={index}/>
                </div>
            );
        }, this);

        return (
            <div className="Vimefeed">
                {vimes}


            </div>
        );
    }
});

var Controls = React.createClass({
    getInitialState: function(){
    return {paging: true};

},
    componentDidMount: function(){
        $(paging).on('true', function(e){

            this.setState({paging: true});
        }.bind(this));

        $(paging).on('false', function(e){

            this.setState({paging: false});
        }.bind(this));
    },

    componentWillUnmount: function () {
        $(paging).off();

    },


    moreChange: function (e) {

        return this.props.updateFilter(e);
    },

        render: function () {

        return (
            <fieldset>
                <select className="more" onChange={this.moreChange}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>

                </select>
                <label><input type="checkbox" className="likes" onClick={this.moreChange}/>Only users better than 10
                    likes, please</label>
                <input className="filter" type="text" placeholder="filter" onChange={this.moreChange}/>
                Showing {this.props.bounds[0]} - {this.props.bounds[1]} of 50
                {this.state.paging ? <div><button className="next" onClick={this.moreChange}>Next</button> </div> : <b> </b>}
                {(this.props.bounds[0] != 0) ? <div><button className="previous" onClick={this.moreChange}>Previous</button> </div> : <b> </b>}
            </fieldset>
        );


    }
});


var VimeBox = React.createClass({

    getInitialState: function () {
        return {
            data: [],
            i: 0,
            show: 10,
            bounds: [0,10],
            substring: "",
            allLikes: false,
            paging: true,
            pages: 5
        };
    },
    handleChange: function (e) {


        switch (e.target.className) {
            case "more":
                var a = 0;
                var b = parseInt(e.target.value);

                this.setState({bounds: [a,b]});
                this.setState({show: b});


                break;
            case "likes":
                this.setState({allLikes: !this.state.allLikes});

                break;
            case "filter":
                this.setState({substring: e.target.value});

                break;
            case "next":
                this.setState({bounds: [this.state.bounds[0]+this.state.show, this.state.bounds[1]+this.state.show]});
                break;
            case "previous":
                this.setState({bounds: [this.state.bounds[0]-this.state.show, this.state.bounds[1]-this.state.show]});
                break;
        }

    },

    togglePaging: function(val) {

      this.setState({paging: val});
    },


    componentDidMount: function () {

        $.ajax({
            url: this.props.url,
            dataType: 'json',
           // crossDomain: true, Turn of Cors and fix mime types on Azure instead.
            cache: true,
            success: function (data) {
                this.setState({data: data});

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());

            }.bind(this)
        });
    },

    render: function () {

        return (
            <div className="vimeBox">
                <Controls updateFilter={this.handleChange} bounds={this.state.bounds} paging={this.state.paging} show={this.state.show} data={this.state.data}/>
                <h1>Vimeo-feed</h1>


                <VimeList vimes={this.state.data} bounds={this.state.bounds} show={this.state.show} allLikes={this.state.allLikes}
                          substring={this.state.substring} updateFilter={this.handleChange} togglePaging={this.togglePaging}/>

            </div>
        );
    }
});


ReactDOM.render(
    <VimeBox url='some.json'/>,
    document.getElementById('content')
);



//TODO: Add pagination. It's a filter with two bounds, upper and lower.