    import { Response } from 'express';

    export default (res: Response, error: Error) => {
        res.status(500).json({
            succes: false,
            message: error.message ? error.message : error
        })
    }