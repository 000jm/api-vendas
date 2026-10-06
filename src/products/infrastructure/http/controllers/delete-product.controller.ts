
import dataValidation from "@/common/infrastructure/validation/zod";
import DeleteProductUseCase from "@/products/application/usecases/delete/delete-product.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import z from "zod";

async function deleteProductController(req: Request, res: Response) {
    const deleteProductSchema = z.object({
        id: z.string()
    })

    const validData = await dataValidation(deleteProductSchema, req.params)

    const deleteProductUseCase: DeleteProductUseCase.UseCase = container.resolve('DeleteProductUseCase')

    await deleteProductUseCase.execute(validData)

    return res.status(204).send()
}
export default deleteProductController
