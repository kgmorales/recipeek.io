import React, { useEffect, useState } from 'react';
import Recipe from './components/recipe/Recipe';
import Nav from './components/nav/Nav';
import { getItem } from './components/Methods';
import Loader from './components/loader/Loader';
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
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [scrollY, setScrollY] = useState(0);
	const logScroll = () => setScrollY(window.pageYOffset >= 130);
	const scrollToTop = () => window.scrollTo(315, 315);
	const notScroll = scrollY === false;

	library.add(faClock, faUsers, faWeight, faUser);
	const updateSearch = (e) => {
		setSearch(e.target.value);
	};

	const getSearch = (e) => {
		e.preventDefault();
		setIsLoading(true);
		setQuery(search);
	};
	useEffect(() => {
		const API = `https://api.edamam.com/search?q=${query}&app_id=${eId}&app_key=${eKey}`;
		if (query) {
			getItem(API)
				.then((res) => {
					console.log(res.hits);
					setIsLoading(false);
					setRecipes(res.hits);
					scrollToTop();
					setSearch('');
				})
				.catch((err) => {
					setError(err);
				});
		}
	}, [query]);

	useEffect(() => {
		const addWatch = () => window.addEventListener('scroll', logScroll);
		const removeWatch = () => window.removeEventListener('scroll', logScroll);
		addWatch();
		return () => removeWatch();
	}, []);

	return (
		<div className='App'>
			<Nav
				getSearch={getSearch}
				search={search}
				updateSearch={updateSearch}
				scroll={scrollY}
			/>
			{isLoading && notScroll ? (
				<div className='loader_container'>
					<Loader className='loader' />
				</div>
			) : (
				<main className={`${scrollY ? `main_s` : ''}`}>
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
									scroll={scrollY}
								/>
							);
						})
					)}
				</main>
			)}
		</div>
	);
};

export default App;
