const neo4j = require('neo4j-driver').v1;
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

require('dotenv').config();

var driver = neo4j.driver("bolt://db:7687", neo4j.auth.basic("neo4j", "_^p7dHe*hJXp7aGd"));

var session = driver.session();

module.exports = {
    resolver:  {
    Query: {
        user: (_, args, ctx) => {

            let token = jsonwebtoken.verify(ctx.request.get('Authorization'), process.env.JWT_SECRET);
            let username = token.username;
            if (!username) {
                throw new Error('You are not authenticated!')
            }

            let query = `
            MATCH (u:User) 
            WHERE u.username = $username 
            RETURN u { 
                .username,
                .supervisorId,
                .active,
                .createdBy,
                .createdDate,
                profile: [(u) -[Profile]-> (p:Profile) | p { 
                    .firstName, 
                    .middleName,
                    .lastName,
                    .phoneNumber,
                    .emailId,
                    .bio,
                    .gender,
                    .religion,
                    .category,
                    .nationality,
                    .dateOfBirth }] 
                } AS data;
            `;

            let result = session.run(query, {
                username
            }).
            then(result => {
                session.close();
                return result.records.map(record => {
                    return record.get("data");
                })
            });
            return   result;
        }
    },
    Mutation: {
        register: (_, {
            username,
            password,
            question,
            answer,
            hint
        }, cntx) => {
            let query = `
            MERGE (u:User {
                username: $username
            }) 
            MERGE (u)-[:AUTH]->(a:Auth)-[:PASSWORD]->(p:Password {
                password: $password,
                question: $question,
                answer: $answer,
                hint: $hint,
                createdDate: $createdDate
            })
            RETURN u { 
                .username 
             } AS data;
            `;

            password =   bcrypt.hash(password, 10);
            let createdDate = new Date();
            createdDate = toString(createdDate);

            question = question ? question : "null";
            answer = answer ? answer : "null";
            hint = hint ? hint : "null";

            let result = session.run(query, {
                username,
                password,
                question,
                answer,
                hint,
                createdDate
            }).
            then(result => {
                session.close();
                return result.records.map(record => {
                    return record.get("data");
                })
            });

              result;

            let id = () => {
                return {
                    result: [{
                        username
                    }]
                }
            }

            result = [{
                key: jsonwebtoken.sign({
                        username: id().result[0].username
                    },
                    process.env.JWT_SECRET, {
                        expiresIn: '1y'
                    }
                )
            }];

            return result

        }
    }
}
}

// let query2 = `
//       MATCH (u:User) WHERE u.username = $username return u { .username, .supervisorId, .active, .createdBy, .createdDate, profile: [(u) -[Profile]-> (p:Profile) | p { .firstName, .middleName }] } AS data;

//       CREATE (u:User { username: "shreyansh", supervisorId: "saurbh-jaiswal", active: true, createdBy: "sneha", createdDate: "12/2/2015 11:12" })
//       RETURN u

//       MATCH (b:User {username : "shreyansh"})
//       MERGE p = (a:Profile {firstName: "Shreyansh", middleName: "Kumar", lastName: "Mehta", phoneNumber: 6394875958, emailId: "shrey.binary@gmail.com", bio: "I'm Great", gender: "Male", religion: "Hindu", category: "GEN", nationality: "Indian", dateOfBirth: "07/10/1999"}) <-[c:PROFILE]- (b)
//       RETURN p
//       `;
