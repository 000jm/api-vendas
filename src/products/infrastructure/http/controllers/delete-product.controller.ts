
import DeleteProductUseCase from "@/products/application/usecases/delete/delete-product.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { deleteProductSchema } from "../schemas/product.schemas";
import { productDataValidation } from "@/common/infrastructure/validation/zod";

async function deleteProductController(req: Request, res: Response): Promise<Response> {

    const validData = await productDataValidation(deleteProductSchema, req.params)

    const deleteProductUseCase: DeleteProductUseCase.UseCase = container.resolve('DeleteProductUseCase')

    await deleteProductUseCase.execute(validData)

    return res.status(200).json({ message: 'Product has been deleted!!' })
}
export default deleteProductController

