import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import PointingList from './PointingList';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
class Pointings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      messages: [],
      pointage:[],
      limit: 5,
      pointing1 : null,
      pointing2 : null,
      pointing3 : null,
      pointing4 : null,
    };
  }

  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .messages()
      .orderBy('createdAt', 'desc')
      .limit(this.state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let messages = [];
          let pointage = [] ;
          snapshot.forEach(doc =>{
            messages.push({ ...doc.data(), uid: doc.id });
            //push to pointage from firebase
            pointage.push({ pointing1:doc.data().pointage1, uid: doc.id})
           }
          );
          console.log('------------->ddddddddddd ',messages)
          this.setState({
            messages: messages.reverse(),
            loading: false,
          },() => {
            console.log('message', messages)
          });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value ,pointing1 : new moment().format('LTS')});
  };

  onCreateMessage = (event, authUser) => {

      this.props.firebase.messages().add({
        pointing1: moment().toString(),
        pointing2: null,
        pointing3: null,
        pointing4: null,
        createdAt: this.props.firebase.fieldValue.serverTimestamp(),
        userId:  authUser.uid,
      });
      this.setState({ text: '' });

      event.preventDefault();



  };

  onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;
    if(message.pointing1 && !message.pointing2 && !message.pointing3 && !message.pointing4 ) {
      this.props.firebase.message(message.uid).update({
        ...messageSnapshot,
        pointing2:  moment().toString(),
        editedAt: this.props.firebase.fieldValue.serverTimestamp(),
      });
      return;
    }else if(message.pointing2 && !message.pointing3 && !message.pointing4){
      this.props.firebase.message(message.uid).update({
        ...messageSnapshot,
        pointing3:  moment().toString(),
        editedAt: this.props.firebase.fieldValue.serverTimestamp(),
      });
      return;
    }else if(message.pointing3 && !message.pointing4){
      this.props.firebase.message(message.uid).update({
        ...messageSnapshot,
        pointing4:  moment().toString(),
        editedAt: this.props.firebase.fieldValue.serverTimestamp(),
      });
      return;
    }

  };
  onResetPointage = (message, text) => {
    const { uid, ...messageSnapshot } = message;
    this.props.firebase.message(message.uid).update({
      ...messageSnapshot,
      pointing1: null,
      pointing2: null,
      pointing3: null,
      pointing4: null,
    });

  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).delete();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages,
    );
  };

  render() {
    const { text, messages, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading && <div>Loading ...</div>}

            {messages && (
              <PointingList
                authUser={authUser}
                messages={messages}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}

            {!messages && <div>There are no tracking ...</div>}

            {!messages &&  <Button type="submit" onClick={event =>
              this.onCreateMessage(event, authUser)
            }>Start</Button> }

          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Pointings);
