const template = `
<p>Dear {{post}}, </p>

<p>You have a new application for preparing a letter to release a body.</p>
<p>
    Below is the information the applicant entered in their online application. Attached are the documents they submitted.
    Use them to create a new case in Orbit.
</p>
<p>
    If the applicant needs to book an appointment, you’ll get a separate email from CABS when they complete their booking.
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
    <li>Applicant is next of kin: {{ applicantIsNok }}</li>
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
