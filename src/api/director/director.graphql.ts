import Director from "./director.model";

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} from "graphql";

// // // //

const DirectorType = new GraphQLObjectType({
    name: "director",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        user_id: {
            type: GraphQLString
        }
    })
});

// // // //

export const queryFields = {
    director: {
        type: DirectorType,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve(parent: any, args: any) {
            console.log("parent");
            console.log(parent);
            return Director.findById(args.id);
        }
    },
    directors: {
        type: new GraphQLList(DirectorType),
        resolve(parent: any, args: any, options: any) {
            console.log(parent);
            console.log(args);
            // console.log(options.res.req.user.id);
            // console.log(options);
            // const user_id: string = options.res.req.user.id;
            // console.log(Object.keys(options.res.req.user.uuid));
            const user_id = options.res.req.user.uuid;
            console.log(user_id);

            return Director.find({ user_id });
        }
    }
};

// // // //

export const mutationFields = {
    addDirector: {
        type: DirectorType,
        args: {
            name: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve(parent: any, args: any, options: any) {
            const user_id = options.res.req.user.uuid;
            let director = new Director({
                name: args.name,
                user_id
            });
            return director.save();
        }
    }
};
