import faker from 'faker'
import Module from './models/module.js'
async function populateDatabase() {
    try {

        const modules = Array.from({ length: 2 }, () => ({
            name: faker.lorem.words(2),
            grammarParts: [], // Заповніть відповідно до вашого проекту
            videos: [faker.internet.url(), faker.internet.url()],
            text: {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
            },
            vocabulary: [
                { word: faker.lorem.word(), translation: faker.lorem.word() },
                { word: faker.lorem.word(), translation: faker.lorem.word() },
            ],
            exercises: [], // Заповніть відповідно до вашого проекту
        }));

        // Зберігаємо модулі в базі даних
        const savedModules = await Module.create(modules);

        console.log('Database populated:', savedModules);
    } catch (error) {
        console.error('Error populating database:', error);
    }
}

// Викликаємо функцію для наповнення бази даних
populateDatabase();
