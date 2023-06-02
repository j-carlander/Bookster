/**
 * This file is to be used in the pop up for when a admin wants to add or edit a book
 * It uses the bookContent and setBookContent prop to keep track of changes made to the book and what method to be used
 * The method is in http format to be easily used in the corresponding fetches.
 * It also takes props allBooks and setAllBooks for saving the response
 * It sets the BookContent state to an initil value-empty object when closed
 */

import React from "react";
import ButtonComponent from "../ButtonComponent";
import fetchService from "../../../service/fetchService";
import "./EditAddPopUp.css";
const initialState = {
  current: { title: "", author: "", quantity: 0 },
  previous: {},
};

export default function EditAddPopUp({
  editAddRef,
  method,
  bookContent,
  setBookContent,
  allBooks,
  setAllBooks,
}) {
  async function handleMethod() {
    const body =
      method === "POST"
        ? { ...bookContent.current }
        : {
            previous: { title: bookContent.previous.title },
            current: { ...bookContent.current },
          };
    const result = await fetchService.adminBooks(method, body);

    alert(result.message);
    if (allBooks.version !== result.context.version)
      setAllBooks(result.context);
    setBookContent(initialState);
    editAddRef.current.close();
  }

  return (
    <form>
      {/* <button onClick={(e) => {e.preventDefault(); editAddRef.current.close()}}>X</button> */}
      <h3 className="editAdd-header" data-testid="editAdd-header">
        {method === "POST" ? "Add" : "Edit"} book
      </h3>
      <label className="title-styling" data-testid="title-label">
        {method === "POST" ? "Title:" : `Title - ${bookContent.previous.title}`}
      </label>
      <input
        type="text"
        placeholder="Insert new title here"
        value={bookContent.current.title}
        onChange={(e) =>
          setBookContent({
            ...bookContent,
            current: { ...bookContent.current, title: e.target.value },
          })
        }
      />
      <label className="author-styling">
        {method === "POST"
          ? "Author:"
          : `Author - ${bookContent.previous.author}`}
      </label>
      <input
        type="text"
        placeholder="Insert new author here"
        value={bookContent.current.author}
        onChange={(e) =>
          setBookContent({
            ...bookContent,
            current: { ...bookContent.current, author: e.target.value },
          })
        }
      />
      <label className="quantity-styling">
        {method === "POST"
          ? "Quantity:"
          : `Quantity - ${bookContent.previous.quantity}`}
      </label>
      <input
        type="number"
        placeholder="Insert new quantity here"
        value={bookContent.current.quantity}
        onChange={(e) =>
          setBookContent({
            ...bookContent,
            current: {
              ...bookContent.current,
              quantity: Number(e.target.value),
            },
          })
        }
      />
      <div>
        <ButtonComponent
          className={"btn-save-changes"}
          onClick={handleMethod}
          txt={"Save changes"}
        />
        <ButtonComponent
          className={"btn-discard-changes"}
          onClick={(e) => {
            e.preventDefault();
            setBookContent(initialState);
            editAddRef.current.close();
          }}
          txt={"Discard changes"}
        />
      </div>
    </form>
  );
}
