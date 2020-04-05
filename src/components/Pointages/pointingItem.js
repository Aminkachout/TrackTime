import React, { Component } from 'react';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class PointingItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.tracking.text,
      switchStop:false,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.tracking.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.setState({switchStop: !this.state.switchStop})
    this.props.onEditPointing(this.props.tracking, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, tracking, onRemoveMessage } = this.props;
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
            {authUser && tracking && authUser.uid === tracking.userId && (
              <span>
              <Button onClick={this.onSaveEditText} variant={this.state.switchStop ? 'success' : 'danger'}>{this.state.switchStop ? 'Start' :'Stop'}</Button>{' '}

                {!editMode && (
                  <Button onClick={() => onRemoveMessage(tracking && tracking.uid)}>
                    Delete
                  </Button>
                )}
          </span>
            )}
            <Table striped bordered hover style={{marginTop: '20px'}}>
              <thead>
              <tr>
                <th>#</th>
                <th>Arriving time  </th>
                <th>Break time</th>
                <th>Break time</th>
                <th>Exit time</th>
                <th>Amount hours</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>1</td>
                <td>{(moment(tracking.pointing1).format('LTS')).toString()}</td>
                <td>{tracking.pointing2 ? (moment(tracking.pointing2).format('LTS')).toString(): '--'}</td>
                <td>{tracking.pointing3 ? (moment(tracking.pointing3).format('LTS')).toString() : '--'}</td>
                <td>{tracking.pointing4 ?(moment(tracking.pointing4).format('LTS')).toString(): '--'}</td>
                <td>
                  {tracking.pointing2 && tracking.pointing1 && tracking.pointing3 && tracking.pointing4  ?(((moment.duration(moment(tracking.pointing2).diff(moment(tracking.pointing1)))).hours()) + (moment.duration(moment(tracking.pointing4).diff(moment(tracking.pointing3)))).hours()).toString()+'H' : '--'}

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
