import { Request, Response, NextFunction } from "express";
import Director from "./director.model";
import { getPaginationParams } from "../../lib/pagination";

// // // //

// GET /api/directors/:id Index
export async function list(req: Request, res: Response, next: NextFunction) {
    // Gets pagination variables for query
    const { page, per_page, offset } = getPaginationParams(req);

    // NOTE - the `countDocuments` operation is another call to MongoDB
    // This can be potentially expensive, you may want to remove it
    // It's currently included so pagination functions correctly on the front-end
    const count = await Director.countDocuments({});

    Director.find({})
        .limit(per_page)
        .skip(offset)
        .lean()
        .exec()
        .then(directors => {
            return res.status(200).json({
                page: page,
                per_page: per_page,
                items: directors,
                count: count
            });
        });
    // .catch((err) => { return next(boom.badImplementation(err)); })
}

// POST /api/directors/:id Create
export function create(req: Request, res: Response, next: NextFunction) {
    // Pulls values from req.body
    const { name } = req.body;

    // Creates new Director instance
    const newModel = new Director({
        name
    });

    // Saves new Director instance
    newModel.save().then(resp => {
        // Sends new Director to client
        return res
            .status(200)
            .send(resp)
            .end();
    });
    // .catch((err) => { return next(boom.badImplementation(err)); })
}

// GET /api/directors/:id Show
export function show(req: Request, res: Response, next: NextFunction) {
    Director.findById(req.params.id).then(model => {
        return res
            .status(200)
            .send(model)
            .end();
    });
    // .catch( err => next(boom.badImplementation(err)));
}

// // // //

// PUT /api/directors/:id Update
export function update(req: Request, res: Response, next: NextFunction) {
    // Pulls values from req.body
    const { name } = req.body;

    return Director.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name
            }
        },
        { new: true }
    ).then(response => {
        return res
            .status(200)
            .send(response)
            .end();
    });
    // .catch( err => next(boom.badImplementation(err)));
}

// DELETE /api/directors/:id Destroy
export function destroy(req: Request, res: Response, next: NextFunction) {
    return Director.remove({ _id: req.params.id }).then(response => {
        return res
            .status(200)
            .send(response)
            .end();
    });
    // .catch( err => next(boom.badImplementation(err)));
}
