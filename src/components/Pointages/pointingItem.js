import React, { Component } from 'react';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class PointingItem extends Component {
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
      <>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <>
            {authUser && message && authUser.uid === message.userId && (
              <span>
              <Button onClick={this.onSaveEditText} variant={this.state.switchStop ? 'success' : 'danger'}>{this.state.switchStop ? 'Start' :'Stop'}</Button>{' '}

                {!editMode && (
                  <Button onClick={() => onRemoveMessage(message && message.uid)}>
                    Delete
                  </Button>
                )}
          </span>
            )}
            <Table striped bordered hover style={{marginTop: '20px'}}>
              <thead>
              <tr>
                <th>#</th>
                <th>First </th>
                <th>startDinner</th>
                <th>stop Dinner</th>
                <th>Second</th>
                <th>Result</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>1</td>
                <td>{(moment(message.pointing1).format('LTS')).toString()}</td>
                <td>{message.pointing2 ? (moment(message.pointing2).format('LTS')).toString(): '--'}</td>
                <td>{message.pointing3 ? (moment(message.pointing3).format('LTS')).toString() : '--'}</td>
                <td>{message.pointing4 ?(moment(message.pointing4).format('LTS')).toString(): '--'}</td>
                <td>
                  {message.pointing2 && message.pointing1 && message.pointing3 && message.pointing4  ?(((moment.duration(moment(message.pointing2).diff(moment(message.pointing1)))).hours()) + (moment.duration(moment(message.pointing4).diff(moment(message.pointing3)))).hours()).toString()+'H' : '--'}

                </td>
              </tr>
              </tbody>
            </Table>
          </>
        )}
      </>
    );
  }
}

export default PointingItem;
