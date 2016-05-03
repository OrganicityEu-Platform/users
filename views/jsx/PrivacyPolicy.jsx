import React                from 'react';
import lang                 from '../../lang/en.js'

var PrivacyPolicy = React.createClass({
  render: function() {
    return(
      <div className="oc-privacy-doc">
        <h2 className="pink">
          {lang.Privacy.title}
        </h2>
        <p>
          {lang.Privacy.description}
        </p>
        <h4 className="pink">
          {lang.Privacy.a1}
        </h4>
        <p>
          {lang.Privacy.a1text}
        </p>
        <h4 className="pink">
          {lang.Privacy.a2}
        </h4>
        <p>
          {lang.Privacy.a2text}
        </p>
        <h4 className="pink">
          {lang.Privacy.a3}
        </h4>
        <p>
          {lang.Privacy.a3text}
        </p>
        <h4 className="pink">
          {lang.Privacy.a4}
        </h4>
        <p>
          {lang.Privacy.a4text}
        </p>
        <h4 className="pink">
          {lang.Privacy.a5}
        </h4>
        <p>
          {lang.Privacy.a5text}
          <ul>
            <li>
              {lang.Privacy.a5p1}
            </li>
            <li>
              {lang.Privacy.a5p2}
            </li>
            <li>
              {lang.Privacy.a5p3}
            </li>
            <li>
              {lang.Privacy.a5p4}
            </li>
            <li>
              {lang.Privacy.a5p5}
            </li>
            <li>
              {lang.Privacy.a5p6}
            </li>
          </ul>
        </p>
        <h4 className="pink">
          {lang.Privacy.a6}
        </h4>
        <p>
          {lang.Privacy.a6text}
        </p>
        <h4 className="pink">
          {lang.Privacy.a7}
        </h4>
        <p>
          {lang.Privacy.a7text}
        </p>
        <h4 className="pink">
          {lang.Privacy.sectionVtitle}
        </h4>
        <p>{lang.Privacy.article12}</p>
        <p>{lang.Privacy.article12text}</p>
        <ol type="a">
          <li>
            {lang.Privacy.article12point_a}
            <ul>
              <li>
                {lang.Privacy.article12point_a_1}
              </li>
              <li>
                {lang.Privacy.article12point_a_2}
              </li>
              <li>
                {lang.Privacy.article12point_a_3}
              </li>
            </ul>
          </li>
          <li>
            {lang.Privacy.article12point_b}
          </li>
          <li>
            {lang.Privacy.article12point_a}
          </li>
        </ol>
      </div>
    );
  }
});

export default PrivacyPolicy;
