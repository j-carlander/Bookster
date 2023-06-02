/**
 * This file is to be used in the pop up confirmation when a admin wants to delete a user or book or promote a user
 * It uses the pageState prop to keep track of which page its currently used on and what method
 * The method is in http format to be easily used in the corresponding fetches.
 * It also takes props for what user or book is to be updated and the user or books states or setStates for saving the response
 */

import React from "react";
import ButtonComponent from "../ButtonComponent";
import fetchService from "../../../service/fetchService";
import "./PromoteDeletePopUp.css";
export default function PromoteDeletePopUp({
  promoteDeleteRef,
  pageState,
  method,
  title,
  username,
  setListState,
  listState,
}) {
  async function handleMethod() {
    const body = pageState === "books" ? { title } : { username };
    const result =
      pageState === "books" && method === "DELETE"
        ? await fetchService.adminBooks(method, body)
        : await fetchService.adminUsers(method, body);

    console.log(result);
    alert(result.message);
    if (listState.version !== result.context.version)
      setListState(result.context);
    promoteDeleteRef.current.close();
  }

  return (
    <article>
      {method === "DELETE" && (
        <h3 className="delete-header" data-testid="delete-header">
          {pageState === "books" ? "Delete book" : "Delete user"}
        </h3>
      )}
      {method === "PUT" && (
        <h3 className="promote-header" data-testid="promote-header">
          Change users role
        </h3>
      )}
      <p>{`Are you sure you wish to ${
        method === "DELETE" ? "delete" : "promote"
      } 
        ${pageState === "books" ? "book" : "user"} 
        ${
          pageState === "books"
            ? title
            : method === "PUT"
            ? `${username} to admin`
            : username
        }`}</p>
      <div>
        <ButtonComponent
          className="btn-promote-delete"
          txt={method === "PUT" ? "Promote" : "Delete"}
          onClick={handleMethod}
        />
        <ButtonComponent
          className="btn-cancel-delete"
          onClick={(e) => {
            e.preventDefault();
            promoteDeleteRef.current.close();
          }}
          txt={"Cancel"}
        />
      </div>
    </article>
  );
}
