import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    query: "",
    colors: []
}
const filterSlice = createSlice(
    {
        name: "filter",
        initialState: initialState,
        reducers: {
            queryUpdated: (state, action) => {
                let newQuery = action.payload.toUpperCase();
                state.query = newQuery;
            },
            colorAdded: (state, action) => {
                let newColors = state.colors;

                if (!newColors.includes(action.payload)) newColors.push(action.payload);
                state.colors = newColors;
            },
            colorRemoved: (state, action) => {
                let newColors = state.colors.filter(color => color !== action.payload);
                state.colors = newColors;
            }
        }
    }
)

export default filterSlice.reducer;
export const {queryUpdated, colorAdded, colorRemoved} = filterSlice.actions;
export const selectFilters = (state) => state.filters;