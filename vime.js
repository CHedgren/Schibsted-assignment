var Vime = React.createClass({

    render: function () {


        return (
            <section className="vime">
                <Author className="author" user = {this.props.list.user}/>

                <Blurb className="blurb" blurb = {this.props.list}/>
                <Stats className="stats" stats = {this.props.list.stats} likes = {this.props.list.metadata.connections.likes} comments= {this.props.list.metadata.connections.comments}/>
            </section>
        );
    }
});

var Author = React.createClass({
    render: function() {
        var imglink= this.props.user.pictures;

        var name = this.props.user.name;
        return (
            <div className="stats">
                <img src="https://i.vimeocdn.com/portrait/4547961_75x75.jpg?r=pad" alt="Author"/>

                {name}
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
            <div className="stats">
                <h1> {name} </h1>
                <p>{desc}</p>

            </div>
        );
    }
});


var VimeList = React.createClass({

      render: function() {
          var showN = this.props.showN;
          var substring = this.props.substring;
          var likesN = this.props.likesN;
          var content = this.props.vimes.list ? this.props.vimes.list : [];

        var vimes = content.filter(function(e, i){

            return i < showN}).filter(function(e, i){

            return e.metadata.connections.likes.total < 30000}).filter(function(e, i){

            return e.description.indexOf(substring) > -1}).map(function(list, index) {

            return (
                <div>

                <Vime list={list} />
                    </div>
            );
        });
        return (
            <div className="Vimefeed">
                {vimes}


            </div>
        );
    }
});


var VimeBox = React.createClass({

    getInitialState: function () {
        return {data: [],
            showN: 10,
            substring: "",
        likesN: 1};
    },
    handleChange: function(event) {
        this.setState({substring: event.target.value});
    },
    componentDidMount: function () {

        $.ajax({
            url: this.props.url,
            dataType: 'json',
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
            <main className="vimeBox">
                <button onClick={function(){this.setState({showN: this.state.showN + 1})}.bind(this)}>   {this.state.showN}    </button>
                <button onClick={function(){this.setState({likesN: this.state.likesN * 2 })}.bind(this)}>   {this.state.likesN}    </button>
                <input type="text" value={this.state.value} onChange={this.handleChange}/> {this.state.substring}
                <h1>Vimeo-feed</h1>
                <VimeList vimes={this.state.data} showN = {this.state.showN} likesN = {this.state.showN} substring = {this.state.substring}/>

            </main>
        );
    }
});




ReactDOM.render(
    <VimeBox url='/some.json'/>,
    document.getElementById('content')
);