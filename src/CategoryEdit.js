// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams, Link } from "react-router-dom";
// import { updateCategory } from "./store";

// const CategoryEdit = () => {
//   const { id } = useParams();
//   const { categories } = useSelector((state) => state);
//   const dispatch = useDispatch();

//   const category = categories.find((category) => category.id === id);

//   const [name, setName] = useState(category.name);

//   const handleUpdate = () => {
//     const updatedCategory = { ...category, name };
//     dispatch(updateCategory(updatedCategory));
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <button onClick={handleUpdate}>Update</button>
//       <Link to="/">Go back</Link>
//     </div>
//   );
// };

// export default CategoryEdit;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCategory } from "./store";
import { useNavigate, useParams } from "react-router-dom";

// Step 3 - Edit Category - Add this component to handle the editing of a category
// it will retrieve the category from the Redux store and populate the input field with the category name
// it will also have an onClick event handler that will dispatch the updateCategory action creator
// and then navigate to the home page with the updated category

const CategoryEdit = () => {
  const { categories } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");

  // this useEffect hook will run when the component mounts and will retrieve the category from the Redux store
  // and populate the input field with the category name
  useEffect(() => {
    const category = categories.find((category) => category.id === id * 1); // we multiply id by 1 to convert it to a number
    if (category) {
      setName(category.name);
    }
  }, [categories, id]);

  const update = async (ev) => {
    ev.preventDefault();
    const category = {
      id: id * 1,
      name,
    };
    await dispatch(updateCategory(category));
    navigate("/");
  };

  return (
    <form onSubmit={update}>
      <input value={name} onChange={(ev) => setName(ev.target.value)} />
      <button disabled={name === ""}>Update Category</button>
    </form>
  );
};
// in the return JSX, we have an input field and a button with an onClick event handler
// the onClick event handler will dispatch the updateCategory action creator and then navigate to the home page

export default CategoryEdit;
