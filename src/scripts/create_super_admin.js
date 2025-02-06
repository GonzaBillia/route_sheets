import sequelize from "../config/database.js";
import { User } from "../models/index.models.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()

const createSuperAdmin = async () => {
    try {
        await sequelize.sync();

        const existingSuperAdmin = await User.findOne({ where: { role_id: 4 } });
        const pwd = process.env.SADMIN_PASS
        if (!existingSuperAdmin) {
            const hashedPassword = await bcrypt.hash(pwd.trim(), 10);
            console.log(hashedPassword)
            await User.create({
                username: "Superadmin",
                email: process.env.SADMIN_EMAIL,
                password: hashedPassword,
                role_id: 4,
                deposito_id: null,
                sucursal_id: null
            });
            console.log("✅ Usuario superadmin creado");
        } else {
            console.log("✅ Usuario superadmin ya existe");
        }
    } catch (error) {
        console.error("❌ Error creando el superadmin:", error);
    } finally {
        process.exit();
    }
};

createSuperAdmin();