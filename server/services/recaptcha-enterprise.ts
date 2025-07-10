// @ts-nocheck
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

interface RecaptchaAssessmentOptions {
  projectID?: string;
  recaptchaKey?: string;
  token: string;
  recaptchaAction?: string;
}

/**
 * Create an assessment to analyze the risk of a UI action using reCAPTCHA Enterprise.
 */
export async function createRecaptchaAssessment({
  projectID = "fluid-root-462823-c7",
  recaptchaKey = "6LeX_XMrAAAAAOE1YUBRSnQb70l9FJra_s2Ohb8u",
  token,
  recaptchaAction = "login",
}: RecaptchaAssessmentOptions) {
  try {
    // Create the reCAPTCHA client
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    // Build the assessment request
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
          expectedAction: recaptchaAction,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    // Check if the token is valid
    if (!response.tokenProperties?.valid) {
      console.log(`reCAPTCHA assessment failed: ${response.tokenProperties?.invalidReason}`);
      return {
        success: false,
        score: 0,
        reason: response.tokenProperties?.invalidReason || 'Invalid token',
      };
    }

    // Check if the expected action was executed
    if (response.tokenProperties.action === recaptchaAction) {
      const score = response.riskAnalysis?.score || 0;
      const reasons = response.riskAnalysis?.reasons || [];
      
      console.log(`reCAPTCHA score: ${score}`);
      reasons.forEach((reason) => {
        console.log(`reCAPTCHA reason: ${reason}`);
      });

      return {
        success: true,
        score,
        reasons,
        valid: score >= 0.5, // Threshold for valid user
      };
    } else {
      console.log("The action attribute in reCAPTCHA tag does not match expected action");
      return {
        success: false,
        score: 0,
        reason: 'Action mismatch',
      };
    }
  } catch (error) {
    console.error('reCAPTCHA Enterprise error:', error);
    return {
      success: false,
      score: 0,
      reason: 'Assessment failed',
      error: error.message,
    };
  }
}