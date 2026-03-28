    import express from 'express';
    import { 
        addFood, 
        listFood, 
        removeFood,
        toggleFoodStatus   // ✅ NEW
    } from '../controllers/foodController.js';
    import multer from 'multer';

    const foodRouter = express.Router();

    // ================================
    // IMAGE STORAGE
    // ================================
    const storage = multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
            return cb(null, `${Date.now()}-${file.originalname}`);
        }
    });

    const upload = multer({ storage });

    // ================================
    // ROUTES
    // ================================

    // Get all foods
    foodRouter.get("/list", listFood);

    // Add food
    foodRouter.post("/add", upload.single('image'), addFood);

    // Remove food
    foodRouter.post("/remove", removeFood);

    // ✅ NEW: Pause / Resume food
    foodRouter.post("/toggle", toggleFoodStatus);

    export default foodRouter;
