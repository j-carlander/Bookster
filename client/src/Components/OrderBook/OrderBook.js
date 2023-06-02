/**
 * This file is for the component that will allow a signed in user to order a book
 * It renders in each row of the table for books
 * It takes in a book as prop and holds it's own state for that book.
 * It has the functions to alter how many books the user wants to order, limited to how many is in store
 * If the user clicks Order, the component calls the fetchservice buyBooks and handles the response,
 * It takes in the state ant setState function of allBooks and saves the response context to the allBooks state
 */

import { useState } from "react";
import ButtonComponent from "../abstract/ButtonComponent";
import fetchService from "../../service/fetchService";
import "./OrderBook.css";

export default function OrderBook({ book, setAllBooks, allBooks, setQuery }) {
  const bookQty = book.quantity;
  const [bookToOrder, setBookToOrder] = useState({
    title: book.title,
    quantity: 0,
  });

  async function handleOrder() {
    const response = await fetchService.buyBook(bookToOrder);
    alert(`You Have ${response.message}, quantity: ${response.quantity} `);
    setBookToOrder({ ...bookToOrder, quantity: 0 });
    setQuery("");
    if (allBooks.version !== response.context.version)
      setAllBooks(response.context);
  }

  return (
    <div className="order-book-wrapper">
      <ButtonComponent
        className={"dec-amount-btn"}
        testId={"dec-amount-btn"}
        onClick={() => {
          setBookToOrder({
            ...bookToOrder,
            quantity: bookToOrder.quantity - 1,
          });
        }}
        txt={"-"}
        isDisabled={bookToOrder.quantity <= 0}
      />
      <input
        className="order-amount-input"
        data-testid="order-amount-input"
        type="number"
        value={bookToOrder.quantity}
        onChange={(e) => {
          if (e.target.value >= 0 && e.target.value <= Number(bookQty)) {
            setBookToOrder({
              ...bookToOrder,
              quantity: Number(e.target.value),
            });
          }
        }}
      />
      <ButtonComponent
        className={"inc-amount-btn"}
        testId={"inc-amount-btn"}
        onClick={() => {
          setBookToOrder({
            ...bookToOrder,
            quantity: bookToOrder.quantity + 1,
          });
        }}
        txt={"+"}
        isDisabled={bookToOrder.quantity >= bookQty}
      />
      <ButtonComponent
        className={"order-btn"}
        testId={"order-btn"}
        onClick={handleOrder}
        txt={"Order"}
        isDisabled={bookQty === 0}
      />
    </div>
  );
}
