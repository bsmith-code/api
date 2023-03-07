import { Request, Response } from "express"

export const postEmail = async (req: Request, res: Response) => {
  const { body } = req

  console.log(body)

  res.json('')
}
