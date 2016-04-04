import React                        from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import I18nMixin                    from './I18nMixin.jsx';

var LanguageSwitcher = React.createClass({
	mixins: [I18nMixin],

	handleClick: function(eventKey) {
		// call i18nMixin
		this.setCurrentLanguage(eventKey);
	},

	render: function() {
		// English menuitem
		if (this.isCurrentLanguage('en-GB')) {
	      var miEn = <MenuItem eventKey="en-GB" active>English</MenuItem>
		} else {
	      var miEn = <MenuItem eventKey="en-GB">English</MenuItem>
		}
		// Spanish menuitem
		if (this.isCurrentLanguage('es-ES')) {
	      var miEs = <MenuItem eventKey="es-ES" active>Espaniol</MenuItem>
		} else {
	      var miEs = <MenuItem eventKey="es-ES">Espaniol</MenuItem>
		}

		//
		return (
		<DropdownButton bsStyle="link" bsSize="small" title={this.currentLanguageDisplayName()} id="lang-dropdown" onSelect={this.handleClick}>
	      {miEn}
	      {miEs}
	    </DropdownButton>
	    );
	}
});

export default LanguageSwitcher;
