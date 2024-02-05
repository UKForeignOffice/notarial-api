# Dynamic content upload
This is a utility package, which can be used to easily update the dynamic content in the affirmation and CNI forms.
## Scope
The following elements can be updated as part of the upload:
### Affirmation
| element                  | Type             | description                                                                                                     | notes                                                                                                            |
|--------------------------|------------------|-----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| country.additionalDocs   | Dynamic Content  | Used to add items to the list of required documents on the start page                                           | Elements require asterisks at the beginning to be converted into list items                                      |
| country.post             | Dynamic Content  | Used to display the relevant embassy on the confirmation screen                                                 | Will only be populated if there is only one post in the specified country that offers the specified service      |
| country.duration         | Dynamic Content  | Used to display the duration the affirmation/cni is active for on the start page                                |                                                                                                                  |
| country.otherInfo        | Dynamic Content  | Used to display country-specific requirements on the start page                                                 |                                                                                                                  |
| country.noticeLink       | Dynamic Content  | Used to display the booking link on the confirmation page if the user needs to provide notice of their marriage | Will only be populated if there is only one post in the specified country that offers the specified service      |
| country.exchangeLink     | Dynamic Content  | Used to display the booking link on the confirmation page if the user needs to exchange a UK CNI                | Will only be populated if there is only one post in the specified country that offers the specified service      |
| post.noticeLink          | Dynamic Content  | Used to display the booking link on the confirmation page if the user needs to provide notice of their marriage | Will only be populated if there is more than one post in the specified country that offers the specified service |
| post.exchangeLink        | DynamicContent   | Used to display the booking link on the confirmation page if the user needs to exchange a UK CNI                | Will only be populated if there is more than one post in the specified country that offers the specified service |
| countryOffersAffirmation | Form condition   | Used to decide if the selected country will allow the user to use the service                                   |                                                                                                                  |
| countryOffersCNI         | Form Condition   | Used to decide whether the user should be diverted to the CNI form instead                                      |                                                                                                                  |
| countryDoesNotNeedNotice | Form Condition   | Used to decide whether the user should be directed away from the service since it's not needed                  |                                                                                                                  |

## How to use
make sure have Node >=18 installed.

If this is your first time using this package, run `cd dynamic-content-upload` followed by `npm install`.

Next, drop the updated csv into the csv directory. If the csv file relates to general dynamic content, name the csv using the name `content`, or `booking-links` if the csv relates to booking links updates.

Once this is all done, run `npm run upload`, to update the content. Once updated, you will be shown a message confirming the upload was successful, at which point you can push the updated files:
- `runner/src/server/templates/additionalContexts.json`
- `runner/src/server/forms-v3/affirmation.json`
- `runner/src/server/forms-v3/cni.json`