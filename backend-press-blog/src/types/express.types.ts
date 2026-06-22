import { Request, Response } from "express"

export type TypeController = (req: Request, res: Response) => Promise<void>