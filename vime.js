var Vime = React.createClass({

    render: function () {


        return (
            <section className="vime">
                <h1>{this.props.index}</h1>
                <Author className="author" user = {this.props.list.user}/>

                <Blurb className="blurb" blurb = {this.props.list}/>
                <Stats className="stats" stats = {this.props.list.stats} likes = {this.props.list.metadata.connections.likes} comments= {this.props.list.metadata.connections.comments}/>
            </section>
        );
    }
});

var Author = React.createClass({
    render: function() {
        var imglink= this.props.user.pictures.sizes[3].link;

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
            <div className="stats">
                <h1>
                P {plays}
             </h1>
                <h2>
                L {likes}
             </h2>
                <h3>
                C {comments}
             </h3>
            </div>
        );
    }
});


var Blurb = React.createClass({
    render: function() {
        var desc = this.props.blurb.description;
        var name = this.props.blurb.name;
        return (
            <div className="blurb">
                <h1><a href={this.props.blurb.link}> {name}</a> </h1>
                <p>{desc}</p>

            </div>
        );
    }
});


var VimeList = React.createClass({

      render: function() {

          var content = this.props.vimes.list ? this.props.vimes.list : [];
          var bounds = this.props.bounds;
          var allLikes = this.props.allLikes;
          var substring = this.props.substring;

        var vimes = content.filter(function(e, i){

            return i >= bounds[0] && i < bounds[1] }).filter(function(e) {
            if (allLikes)
                return e.user.metadata.connections.likes.total > 10
            return true;

        }).filter(function(e, i){

            if (e.description.indexOf(substring) > -1){
                return true;
            }
            }).map(function(list, index) {

            return (


                <Vime list={list} index={index} />

            );
        });

        return (
            <div className="Vimefeed">
                {vimes}


            </div>
        );
    }
});

var Controls = React.createClass({

    moreChange: function(e) {

            return this.props.updateFilter(e);
        },



    render: function(){
        return (
            <fieldset>
                <select>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>

                </select>
                <label><input type="checkbox" className="likes" onClick={this.moreChange}/>Only user better than 10 likes, please</label>
                <input className="filter" type="text" placeholder="filter" onChange={this.moreChange}/>
                </fieldset>
        );


    }


});


var VimeBox = React.createClass({

    getInitialState: function () {
        return {data: [],
            i: 0,
            bounds: [0,10],
            substring: "",
            allLikes: true};
    },
    handleChange: function(e) {


        switch(e.target.className) {
            case "more":
                this.setState({bounds: [0, [10,25,50][(this.setState({i: (this.state.i +1)%3}))]]});

                break;
            case "likes":
                this.setState({allLikes: !this.state.allLikes});
                console.log(this.state.allLikes)
                break;
            case "filter":
               this.setState({substring: e.target.value});
                console.log(this.state.substring);
                break;
            case "pager":
                this.setState({bounds: [upper, lower]});
                break;
        }
    },


    componentDidMount: function () {

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            crossDomain: true,
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
                <Controls updateFilter={this.handleChange}/>
                <h1>Vimeo-feed</h1>
                <VimeList vimes={this.state.data} bounds = {this.state.bounds} allLikes = {this.state.allLikes} substring = {this.state.substring}/>

            </div>
        );
    }
});




ReactDOM.render(
    <VimeBox url='some.json'/>,
    document.getElementById('content')
);

//TODO: Add a controller component. It's a fieldset, it goes under the heading.

//TODO: Add pagination. It's a filter with two bounds, upper and lower.