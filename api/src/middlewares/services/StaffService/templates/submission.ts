const template = `
<p>Dear {{post}}, </p>

<p>You have a new application for {{type}}.</p>
<p>
    Below is the information the applicant entered in their online application. Attached are the documents they submitted.
    Use them to create a new case in Orbit.
</p>
<p>
    Do not forward this email. Enter the details into Orbit and delete it from the shared mailbox once you have processed the application.
</p>
<p>
    FCDO Documents Policy Team
    <a href="mailto:DocumentPolicyQueries@fcdo.gov.uk">DocumentPolicyQueries@fcdo.gov.uk</a>
</p>

<h2>Application information</h2>

<ul>
    <li>Reference: {{ reference }}</li>
    <li>Country: {{ country }}</li>
    {{#if oathType}}
        <li>Type of declaration: {{ oathType }}</li>
    {{/if}}
    {{#if jurats}}
        <li>
            Physical or mental conditions that would reduce ability to read or sign affirmation: {{ jurats }}
        </li>
    {{/if}}
    <li>Needs passport certification: {{ certifyPassport }}</li>
</ul>

<h3>Fees:</h3>
<ul>
    <li>Paid: {{payment.status}}</li>
    <li>
        Payment amount: {{payment.total}}
    </li>
    <li>
        payment ID: {{ payment.id }} <a href="{{payment.url}}">(View payment details or refund)</a>
    </li>
    <li>
        <a href="{{payment.allTransactionsByCountry.url}}"> View all transactions for {{payment.allTransactionsByCountry.country}}</a>
    </li> 
</ul>



    {{#each questions}}
        {{#if this}}
            <h4>{{@key}}</h4>
            <ul>
                {{#each this}}
                <li>{{this.title}}: {{this.answer}}</li>
                {{/each}}
            </ul>
        {{/if}}
    {{/each}}


`;
export default template;
