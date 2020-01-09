import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ListList from "../components/ListList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserLists = () => {
  const [loadedLists, setLoadedLists] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/lists/user/${userId}`
        );
        setLoadedLists(responseData.lists);
      } catch (err) {}
    };
    fetchLists();
  }, [sendRequest, userId]);

  const listDeletedHandler = deletedListId => {
    setLoadedLists(prevLists =>
      prevLists.filter(list => list.id !== deletedListId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedLists && (
        <ListList items={loadedLists} onDeleteList={listDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserLists;
