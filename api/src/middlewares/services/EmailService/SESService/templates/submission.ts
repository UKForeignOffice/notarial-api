const template = `
<p>Dear {{post}}, </p>

<p>You have a new application for a {{type}}.</p>
<p>
    Below is the information the applicant entered in their online application. Attached are the documents they submitted.
    Use them to create a new case in Casebook and prepare the affirmation document.
</p>
<p>
    The applicant should book an appointment in CABS to swear and sign their affirmation. You’ll get a separate email 
    from CABS when they complete their booking.  
</p>
<p>
    FCDO Documents Policy Team
    <a href="mailto:DocumentPolicyQueries@fcdo.gov.uk">DocumentPolicyQueries@fcdo.gov.uk</a>
</p>

<h2>Application information</h2>

<ul>
    <li>Reference: {{ reference }}</li>
    <li>Country: {{ country }}</li>
    <li>Type of declaration: {{ oathType }}</li>
    <li>
        Physical or mental conditions that would reduce ability to read or sign affirmation: {{ jurats }}
    </li>
    <li>Needs passport certification: {{ certifyPassport }}</li>
</ul>

<h3>Fees:</h3>
<ul>
    <li>Paid: {{payment.status}}</li>
    <li>
        <a href="{{payment.url}}">View payment details or refund (payment ID: {{ payment.id }})</a>
    </li>
    <li>
        <a href="{{payment.allTransactionsByCountry.url}}"> View all transactions for {{payment.allTransactionsByCountry.country}}</a>
    </li> 
</ul>



    {{#each questions}}
        <h4>{{@key}}</h4>
        <ul>
            {{#each this}}
            <li>{{this.title}}: {{this.answer}}</li>
            {{/each}}
        </ul>
    {{/each}}


`;
export default template;
