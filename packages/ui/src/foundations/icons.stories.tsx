import { useState } from "react";
import { iconRegistry, searchIcons } from "../assets/icons";
import {
  iconCode,
  iconContainer,
  iconGrid,
  iconLibraryContainer,
  iconLibraryTitle,
  searchInput,
} from "./icons.css";

export default {
  title: "Foundations/Icons",
};

export const Icons = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredIcons = () => {
    if (searchTerm.trim()) {
      return searchIcons(searchTerm);
    }
    return Object.entries(iconRegistry);
  };

  const filteredIcons = getFilteredIcons();

  return (
    <div className={iconLibraryContainer}>
      <section>
        <h1 className={iconLibraryTitle}>너구디 Icon Library</h1>

        <input
          type="text"
          placeholder="밥, rice, 하트, etc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={searchInput}
        />

        <p
          style={{
            marginBottom: "1.5rem",
            color: "#666",
            fontSize: "0.8rem",
            marginTop: "0.5rem",
            marginLeft: "0.2rem",
          }}
        >
          아이콘을 검색해보세요.
        </p>

        <div className={iconGrid}>
          {filteredIcons.map(([name, data]) => {
            const Comp = data.component;
            return (
              <div key={name} className={iconContainer}>
                {Comp && <Comp width={24} height={24} />}
                <code className={iconCode}>{name}Icon</code>
              </div>
            );
          })}
        </div>

        {filteredIcons.length === 0 && searchTerm && (
          <div
            style={{ textAlign: "center", marginTop: "2rem", color: "#666" }}
          >
            '{searchTerm}'에 대한 검색 결과가 없습니다.
          </div>
        )}
      </section>
    </div>
  );
};
