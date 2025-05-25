app.get('/recipes/by-category', async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: 'Параметр category є обовʼязковим' });
  }

  try {
    const db = firebaseAdmin.firestore();
    const recipesRef = db.collection('recipes');
    const querySnapshot = await recipesRef.where('category', '==', category).get();

    const recipes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        calories: data.calories,
        prepTime: data.prepTime,
        category: data.category,
        ingredients: data.ingredients || [],
        instructions: data.instructions,
        nutrients: data.nutrients || {},
        servings: data.servings,
        youtubeUrl: data.youtubeUrl
      };
    });

    console.log(`Відправляємо ${recipes.length} рецептів для категорії ${category}`);
    console.log('Приклад рецепту:', recipes[0]);

    res.status(200).json({ recipes });
  } catch (error) {
    console.error('Помилка при отриманні рецептів за категорією:', error);
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
}); 