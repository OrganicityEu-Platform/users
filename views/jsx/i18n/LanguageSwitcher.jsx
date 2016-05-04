import React                        from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import I18nMixin                    from './I18nMixin.jsx';
import ui                           from '../../../ui_routes.js';

// Flag SVGs from:
// http://flag-icon-css.lip.is/
var LanguageSwitcher = React.createClass({
	mixins: [I18nMixin],

	handleClick: function(eventKey) {
		// call i18nMixin
		this.setCurrentLanguage(eventKey);
	},

	render: function() {
		var flag = '';
		var mitems = [];
		
		for (var i = 0; i < this.state.languageCodes.length; i++) {
			var lc = this.state.languageCodes[i];
			var currentFlag = ui.asset(this.lookup(lc, 'Meta.flag_url', ''));
			var isCurrent = this.isCurrentLanguage(lc);
			if (isCurrent) {
				flag = currentFlag;
			}
	      	var mi = (
	      		<MenuItem eventKey={lc} active={isCurrent}>
	      			<img src={currentFlag} className="lang-flag" ></img>
	      			{this.languageDisplayName(lc)}
	      		</MenuItem>);
	      	mitems.push(mi);
		}

		var title = <span><img src={flag} className="lang-flag" ></img> {this.i18n('Meta.language_name', '')}</span>;

		return (
			<DropdownButton key="langswitch"
							className="nav-lang-btn"
							navItem={true}
			                bsStyle="link"
							title={title}
							id="lang-dropdown" onSelect={this.handleClick} >
			 	{mitems}
		    </DropdownButton>
	    );
	}
});

export default LanguageSwitcher;
