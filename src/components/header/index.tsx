import style from "./header.module.css";
import { MdDehaze, MdClose, MdLogout } from "react-icons/md";
import menuLogo from "../../assets/logo.png";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [decoration, setDecoration] = useState(1);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("erro ao deslogar");
    }
  }

  return (
    <header>
      <div
        className={` ${style.menu} ${
          openMenu ? style.openMenu : style.closeMenu
        }`}
      >
        <div className={style.menuHeader}>
          <img src={menuLogo} alt="" className={style.menuLogo} />
          <MdClose
            size={32}
            cursor={"pointer"}
            fontWeight={"bold"}
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          />
        </div>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to="/dashboard"
            className={`${style.menuCategory} ${
              decoration == 1 && style.selectedCategory
            }`}
            onClick={() => {
              setOpenMenu(false);
              setDecoration(1);
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className={`${style.menuCategory} ${
              decoration == 2 && style.selectedCategory
            }`}
            onClick={() => {
              setOpenMenu(false);
              setDecoration(2);
            }}
          >
            Histórico
          </Link>
        </nav>

        <button className={style.logout} onClick={handleLogout}>
          Sair <MdLogout size={22} />
        </button>
      </div>
      <div className={style.headerContainer}>
        <div>
          <MdDehaze
            fontWeight={"bold"}
            size={32}
            cursor={"pointer"}
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          />
        </div>
      </div>
    </header>
  );
}
