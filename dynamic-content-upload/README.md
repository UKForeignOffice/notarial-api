# Dynamic content upload
This is a utility package, which can be used to easily update the dynamic content for the notarial api.
## Scope
The following elements can be updated as part of the upload:
### Affirmation
| element                  | Type             | description                                                                                                     | notes                                                                                                            |
|--------------------------|------------------|-----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| country.additionalDocs   | Dynamic Content  | Used to add items to the list of required documents on the start page                                           | Elements require asterisks at the beginning to be converted into list items                                      |
| country.post             | Dynamic Content  | Used to display the relevant embassy on the confirmation screen                                                 | Will only be populated if there is only one post in the specified country that offers the specified service      |
| country.otherInfo        | Dynamic Content  | Used to display country-specific requirements on the start page                                                 |                                                                                                                  |
| country.bookingLink      | Dynamic Content  | Used to display the booking link on the confirmation page if the user needs to provide notice of their marriage | Will only be populated if there is only one post in the specified country that offers the specified service      |
| post.bookingLink         | Dynamic Content  | Used to display the booking link on the confirmation page if the user needs to provide notice of their marriage | Will only be populated if there is more than one post in the specified country that offers the specified service |

## How to use
make sure have Node >=18 installed, and yarn >= v1.22. This project uses yarn 3. Yarn v1.22 will load the correct version of yarn by looking at [.yarnrc](./.yarnrc.yml) and [.yarn](./yarn)

If this is your first time using this package, run `yarn install`.

Next, drop the updated csv into the csv directory. If the csv file relates to general dynamic content, name the csv using the name `content`, or `booking-links` if the csv relates to booking links updates.

Once this is all done, run `yarn dynamic-content upload`, to update the content. Once updated, you will be shown a message confirming the upload was successful, at which point you can push the file `api/src/middlewares/services/EmailService/additionalContexts.json`.