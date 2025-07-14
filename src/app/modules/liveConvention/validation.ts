interface ValidationError {
  property: string;
  reason: string;
}

const isValidationError = (value: any): value is ValidationError => 
  typeof value?.property !== 'undefined' && typeof value?.reason !== 'undefined';

/* CURRIED VALIDATORS */
export const inNumberArray = (allowedNumbers: number[]) => 
  (property: string, value?: number): ValidationError | undefined => {
    if (typeof value === 'undefined') return undefined;

    if (typeof value !== 'number' || isNaN(value)) {
      return {
        property,
        reason: `Value ${value} not allowed, must be of type number`
      };
    }

    if (!allowedNumbers.includes(value)) {
      return {
        property,
        reason: `Value is not valid. Got ${value}, expected ${allowedNumbers}`
      };
    }

    return undefined;
  };

export const isBetween = (min: number, max: number) => 
  (property: string, value?: number): ValidationError | undefined => {
    if (typeof value === 'undefined') return undefined;

    if (typeof value !== 'number' || isNaN(value)) {
      return {
        property,
        reason: `Value ${value} not allowed, must be of type number`
      };
    }

    if (value < min || value > max) {
      return {
        property,
        reason: `Value must in between ${min} and ${max}`
      };
    }

    return undefined;
  };

export const isRequiredAllOrNone = (requiredKeys: string[]) => 
  (body: Record<string, any>): ValidationError | undefined => {
    const presentKeys = Object.keys(body).filter((x) => typeof body[x] !== 'undefined');
    const isValid =
      requiredKeys.every((x) => presentKeys.includes(x)) || 
      requiredKeys.every((x) => !presentKeys.includes(x));

    if (!isValid) {
      return {
        property: '$schema',
        reason: `If one of the following properties is present, all or none must be present: ${requiredKeys.join(', ')}`
      };
    }

    return undefined;
  };

/* VALIDATION RUNNER */
export const validateRequest = (
  body: Record<string, any>,
  propertyValidator: Record<string, ((property: string, value?: any) => ValidationError | undefined | (ValidationError | undefined)[]) | undefined>,
  schemaValidator: Array<(body: Record<string, any>) => ValidationError | undefined>
): ValidationError[] => {
  const schemaValidations = schemaValidator.map((validator) => validator?.(body));
  const propValidations = Object.keys(propertyValidator).flatMap((property) => {
    const value = body?.[property];
    const func = propertyValidator[property];
    if (!func) return [];
    
    const validations = Array.isArray(func) 
      ? func.map((f) => f(property, value)) 
      : func(property, value);
      
    return Array.isArray(validations) ? validations : [validations];
  });
  
  return schemaValidations.concat(propValidations).filter(isValidationError);
};