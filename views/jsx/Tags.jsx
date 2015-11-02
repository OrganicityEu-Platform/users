import React from 'react';
var ReactTags = require('react-tag-input').WithContext;

var Tags = React.createClass({
    getInitialState: function() {
        return {
            tags: [ {id: 1, text: this.props.text} ],
            suggestions: this.props.suggestions
        };
    },
    handleDelete: function(i) {
        var tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    },
    handleAddition: function(tag) {
        var tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    },
    handleDrag: function(tag, currPos, newPos) {
        var tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    },
    render: function() {
        var tags = this.state.tags;
        var suggestions = this.state.suggestions;
        return (
            <div>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} />
            </div>
        );
    }
});

export default Tags;
