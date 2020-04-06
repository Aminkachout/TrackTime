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
      trackings: [],
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
          let trackings = [];
          let pointage = [] ;
          snapshot.forEach(doc =>{
            trackings.push({ ...doc.data(), uid: doc.id });
            //push to pointage from firebase
            pointage.push({ pointing1:doc.data().pointage1, uid: doc.id})
           }
          );
          this.setState({
            trackings: trackings.reverse(),
            loading: false,
          },() => {
            console.log('uid', trackings)
          });
        } else {
          this.setState({ trackings: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    if(this.state.trackings)
    {this.onRemoveMessage(this.state.trackings[0].uid);}
    this.unsubscribe();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value ,pointing1 : new moment().format('LTS')});
  };

  onStart = (event, authUser) => {

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

  onEditPointing = (message, text) => {
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
    const { text, trackings, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading && <div>Loading ...</div>}
            {trackings && (
              <PointingList
                authUser={authUser}
                trackings={trackings}
                onEditPointing={this.onEditPointing}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}

            {!trackings && <div>There are no tracking ...</div>}

            {!trackings &&  <Button type="submit" onClick={event =>
              this.onStart(event, authUser)
            }>Start</Button> }

          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Pointings);
