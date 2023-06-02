/**
 * This file is to render the page for administrating users
 * imports the components needed and renders a table from the result of the fetch of all users.
 */

import THeadComponent from "../Components/TableComponents/THeadComponent";
import TableRowComponent from "../Components/TableComponents/TableRowComponent";
import "./styles/Users.css";
import { useCurrentUser } from "../context/userContext";
import NavigationComponent from "../Components/abstract/NavigationComponent/NavigationComponent";
import { Navigate } from "react-router-dom";
import ButtonComponent from "../Components/abstract/ButtonComponent";
import { useRef, useState, useEffect } from "react";
import PromoteDeletePopUp from "../Components/abstract/PromoteDeletePopUp/PromoteDeletePopUp";
import fetchService from "../service/fetchService";

export default function Users() {
  const currentUser = useCurrentUser();
  const [allUsers, setAllUsers] = useState([]);
  const promoteDeleteRef = useRef();
  const [method, setMethod] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchService.getAllUsers().then((result) => {
      setAllUsers(result);
      setIsLoading(false);
    });
  }, []);

  if (currentUser.role !== "ADMIN") {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="page-wrapper">
      <div className="flex-container-userspage">
        <NavigationComponent />
      </div>
      <table className="users-table-styling">
        <THeadComponent
          col1={"Username"}
          col2={"Role"}
          col3={"Purchases"}
          action={"Action"}
        />
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          ) : allUsers.length <= 0 ? (
            <tr>
              <td colSpan={4}>List is empty</td>
            </tr>
          ) : (
            allUsers.users.map((user) => (
              <TableRowComponent
                key={crypto.randomUUID()}
                col1={user.username}
                col2={user.role}
                col3={user.purchases ? user.purchases.length : "0"}
                action={
                  <div>
                    <ButtonComponent
                      className={"promote-btn"}
                      onClick={() => {
                        setMethod("PUT");
                        setUserAccount(user.username);
                        promoteDeleteRef.current.showModal();
                      }}
                      isDisabled={user.role === "ADMIN"}
                      txt={"Promote"}
                    />
                    <ButtonComponent
                      className={"delete-btn"}
                      onClick={() => {
                        setMethod("DELETE");
                        setUserAccount(user.username);
                        promoteDeleteRef.current.showModal();
                      }}
                      txt={"Delete"}
                    />
                  </div>
                }
              />
            ))
          )}
        </tbody>
      </table>
      <dialog className="promote-delete-dialog" ref={promoteDeleteRef}>
        <PromoteDeletePopUp
          promoteDeleteRef={promoteDeleteRef}
          method={method}
          pageState={"users"}
          username={userAccount}
          setListState={setAllUsers}
          listState={allUsers}
        />
      </dialog>
    </div>
  );
}
