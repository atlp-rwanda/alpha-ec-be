import { z } from "zod";
let passwordStrength =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
const loginValidation = z.object({
  email: z.string().email("Please put valid Email."),
  password: z
    .string()
    .min(8, "password of length less than 8")
    .regex(passwordStrength, "You are using wrong password please try again"),
});
export default loginValidation

