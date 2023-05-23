import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { destroyCategory } from "./store";
import { Link } from "react-router-dom"; // Step 1 - Edit Update - import Link

const Categories = () => {
  const { categories, todos } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <ul>
      {categories.map((category) => {
        const filtered = todos.filter(
          (todo) => todo.categoryId === category.id
        );
        return (
          <li key={category.id}>
            <Link to={`/categories/${category.id}`}>
              {" "}
              {/* Step 2 - Edit Update - add Link */}
              {category.name}
            </Link>
            ({filtered.length})
            <button
              disabled={filtered.length}
              onClick={() => dispatch(destroyCategory(category))}
            >
              x
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Categories;
