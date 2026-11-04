export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source] ?? {});

        if (!result.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: result.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        if (source === 'body') {
            req.body = result.data;
        } else {
            req.validatedData = {
                ...req.validatedData,
                [source]: result.data
            };
        }

        next();
    };
};
