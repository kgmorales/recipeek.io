import React, { useEffect, useState } from 'react';
import Recipe from './components/recipe/Recipe';
import Nav from './components/nav/Nav';
import { getItem } from './components/Methods';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faClock,
	faUsers,
	faWeight,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import './App.css';
const { eKey, eId } = require('./config');

const App = () => {
	const [recipes, setRecipes] = useState([]);
	const [query, setQuery] = useState('');
	const [search, setSearch] = useState('');
	const [searched, setSearched] = useState(false);

	const [error, setError] = useState('');

	library.add(faClock, faUsers, faWeight, faUser);
	const updateSearch = (e) => {
		setSearch(e.target.value);
	};

	const getSearch = (e) => {
		e.preventDefault();
		setQuery(search);
	};
	useEffect(() => {
		const API = `https://api.edamam.com/search?q=${query}&app_id=${eId}&app_key=${eKey}`;
		getItem(API)
			.then((res) => {
				setSearched(true);
				setRecipes(res.hits);
				setSearch('');
			})
			.catch((err) => {
				setError(err);
			});
	}, [query]);

	return (
		<div className='App'>
			<Nav
				getSearch={getSearch}
				search={search}
				updateSearch={updateSearch}
				gotSearched={searched}
			/>
			<main>
				{error ? (
					<li>{error.message}</li>
				) : (
					recipes.map((recipe, i) => {
						return (
							<Recipe
								key={i}
								title={recipe.recipe.label}
								calories={recipe.recipe.calories}
								time={recipe.recipe.totalTime}
								image={recipe.recipe.image}
								ingredients={recipe.recipe.ingredients}
								servings={recipe.recipe.yield}
							/>
						);
					})
				)}
			</main>
		</div>
	);
};

export default App;
