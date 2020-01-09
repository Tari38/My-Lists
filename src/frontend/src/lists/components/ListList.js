import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import ListItem from './ListItem';
import Button from '../../shared/components/FormElements/Button';
import './ListList.css';

const ListList = props => {
  if (props.items.length === 0) {
    return (
      <div className="list-list center">
        <Card>
          <h2>No lists found. Maybe create one?</h2>
          <Button to="/lists/new">Share List</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="list-list">
      {props.items.map(list => (
        <ListItem
          key={list.id}
          id={list.id}
          image={list.image}
          title={list.title}
          description={list.description}
          address={list.address}
          creatorId={list.creator}
          coordinates={list.location}
          onDelete={props.onDeleteList}
        />
      ))}
    </ul>
  );
};

export default ListList;
