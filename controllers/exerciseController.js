import Exercise from "../models/exercise.js";
import Module from "../models/module.js";

// export const createExercise = async (req, res) => {
//     try {
//         const exerciseData = new Exercise(req.body);
//         const result = await exerciseData.save();
//         res.status(201).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };


export const createExercise = async (req, res) => {
    try {
        // Спочатку збережіть нову вправу у базі даних
        const exerciseData = new Exercise(req.body);
        const newExercise = await exerciseData.save();
        // Отримайте _id нової вправи
        const newExerciseId = newExercise._id;

        // Отримайте модуль, до якого ви хочете додати вправу
        const module = await Module.findOne({ name: "Module 1" });

        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        // Додайте новий ідентифікатор вправи до поля "exercises"
        module.exercises.push(newExerciseId);

        // Оновіть документ модуля
        await module.save();

        res.status(201).json({ message: 'Exercise created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const updateOneExercise = async (req, res) => {
    try {
        const { exerciseId } = req.params;

        // Перевірте, чи існує вправа з вказаним ідентифікатором
        const existingExercise = await Exercise.findById(exerciseId);

        if (!existingExercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        // Оновіть дані вправи на основі отриманих від клієнта даних
        existingExercise.title = req.body.title || existingExercise.title;
        existingExercise.content = req.body.content || existingExercise.content;

        // Збережіть оновлену вправу
        const updatedExercise = await existingExercise.save();

        res.status(200).json(updatedExercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export const updateExerciseField = async (req, res) => {
//     try {
//         const { exerciseId } = req.params;
//         const { fieldToUpdate, updatedValue } = req.body;

//         // Перевіряємо, чи існує вправа з вказаним exerciseId
//         const existingExercise = await Exercise.findByIdAndUpdate(
//             exerciseId,
//             { [fieldToUpdate]: updatedValue },
//             { new: true } // опція {new: true} поверне оновлений об'єкт
//         );

//         if (!existingExercise) {
//             return res.status(404).json({ error: 'Exercise not found' });
//         }

//         res.status(200).json(existingExercise);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

export const updateExerciseField = async (req, res) => {
    try {
        const { exerciseId, taskId } = req.params;
        const { fieldToUpdate, updatedValue } = req.body;

        // Перевіряємо, чи існує вправа з вказаним exerciseId та завданням з вказаним taskId
        const existingExercise = await Exercise.findOne({ _id: exerciseId, 'tasks._id': taskId });

        if (!existingExercise) {
            return res.status(404).json({ error: 'Exercise or task not found' });
        }

        // Оновлюємо дані завдання
        existingExercise.tasks.id(taskId).set({ [fieldToUpdate]: updatedValue });
        const updatedExercise = await existingExercise.save();

        res.status(200).json(updatedExercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getOneExercise = async (req, res) => {
    try {
        const { exerciseId } = req.params;

        // Перевіряємо, чи існує вправа з вказаним exerciseId
        const exercise = await Exercise.findById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        res.status(200).json(exercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteOneExercise = async (req, res) => {
    try {
        const { exerciseId } = req.params;

        // Перевіряємо, чи існує вправа з вказаним exerciseId
        const exercise = await Exercise.findById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        // Видаляємо вправу
        await exercise.remove();

        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
