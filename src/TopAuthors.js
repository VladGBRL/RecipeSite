import React, { useEffect, useState } from 'react';

function TopAuthors({ allRecipes }) {
  const [topAuthors, setTopAuthors] = useState([]);

  useEffect(() => {
    const authorCounts = {};

    allRecipes.forEach(recipe => {
      const author = recipe.author.trim();
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });

    const sortedAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([author]) => author);

    setTopAuthors(sortedAuthors);
  }, [allRecipes]);

  return (
    <div>
      <h3>Top Authors</h3>
      <ul>
        {topAuthors.map((author, index) => (
          <li key={index}>{author}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopAuthors;
