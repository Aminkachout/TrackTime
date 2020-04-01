import React, { Component } from 'react';
import moment from 'moment';

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text,
      switchStop:false,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.setState({switchStop: !this.state.switchStop})
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <>
             <span>
          </span>
              <table>
                <thead>
                <th>First </th>
                <th>startDinner</th>
                <th>stop Dinner</th>
                <th>Second</th>
               <th>Result</th>
                </thead>
                <tr>
              <td  style={{  'borderCollapse': 'collapse' ,'border': '1px solid black'}}>{(moment(message.pointing1).format('LTS')).toString()}</td>
              <td  style={{  'borderCollapse': 'collapse' ,'border': '1px solid black'}}>{message.pointing2 ? (moment(message.pointing2).format('LTS')).toString(): '--'}</td>
              <td  style={{  'borderCollapse': 'collapse' ,'border': '1px solid black'}}>{message.pointing3 ? (moment(message.pointing3).format('LTS')).toString() : '--'}</td>
              <td  style={{  'borderCollapse': 'collapse' ,'border': '1px solid black'}}>{message.pointing4 ?(moment(message.pointing4).format('LTS')).toString(): '--'}</td>
              <td  style={{  'borderCollapse': 'collapse' ,'border': '1px solid black'}}>
                {message.pointing2 && message.pointing1 && message.pointing3 && message.pointing4  ?(((moment.duration(moment(message.pointing2).diff(moment(message.pointing1)))).hours()) + (moment.duration(moment(message.pointing4).diff(moment(message.pointing3)))).hours()).toString()+'H' : '--'}
               </td>
                </tr>
              </table>
          </>

        )}

        {authUser.uid === message.userId && (
          <span>
            <button onClick={this.onSaveEditText}>{this.state.switchStop ? 'Start' :'Stop'}</button>

            {!editMode && (
              <button
                type="button"
                onClick={() => onRemoveMessage(message.uid)}
              >
                Delete
              </button>
            )}
          </span>
        )}
      </li>
    );
  }
}

export default MessageItem;
