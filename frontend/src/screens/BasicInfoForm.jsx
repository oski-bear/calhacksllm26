import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

// --- Option lists (kept here so the form is self-contained and easy to read) ---
const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Separated', 'Widowed']

const CITIZENSHIP_OPTIONS = [
  'U.S. Citizen',
  'Permanent Resident (Green Card)',
  'Refugee / Asylee',
  'Other / Undocumented',
]

const EDUCATION_LEVELS = [
  'Less than high school',
  'High school / GED',
  'Some college',
  "Associate's degree",
  "Bachelor's degree",
  'Graduate degree',
]

const BENEFIT_OPTIONS = [
  'CalFresh (SNAP)',
  'Medi-Cal / Medicaid',
  'SSI',
  'CalWORKs / TANF',
  'Unemployment',
  'Section 8 Housing',
]

export default function BasicInfoForm({
  initialValues,
  onSubmit,
  title = 'Find the benefits you qualify for',
  subtitle = "Tell us a bit about your situation. We'll figure out which programs you're eligible for and help you apply.",
  submitLabel = 'Find my programs',
  onBack,
}) {
  const [values, setValues] = useState(initialValues)

  // One generic handler for all the simple (single-value) fields.
  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  // Checkboxes add/remove the benefit from the array.
  function toggleBenefit(benefit) {
    setValues((prev) => {
      const has = prev.currentBenefits.includes(benefit)
      return {
        ...prev,
        currentBenefits: has
          ? prev.currentBenefits.filter((b) => b !== benefit)
          : [...prev.currentBenefits, benefit],
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>

        <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* --- Contact --- */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Full name"
                  fullWidth
                  required
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Grid>

              {/* --- Household basics --- */}
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={values.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  label="Household size"
                  type="number"
                  fullWidth
                  helperText="People in your home"
                  value={values.householdSize}
                  onChange={(e) => handleChange('householdSize', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Annual income (from W-2)"
                  type="number"
                  fullWidth
                  value={values.income}
                  onChange={(e) => handleChange('income', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* --- Status dropdowns --- */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Marital status</InputLabel>
                  <Select
                    label="Marital status"
                    value={values.maritalStatus}
                    onChange={(e) =>
                      handleChange('maritalStatus', e.target.value)
                    }
                  >
                    {MARITAL_STATUSES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    value={values.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  >
                    {STATES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Citizenship status</InputLabel>
                  <Select
                    label="Citizenship status"
                    value={values.citizenship}
                    onChange={(e) => handleChange('citizenship', e.target.value)}
                  >
                    {CITIZENSHIP_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Education</InputLabel>
                  <Select
                    label="Education"
                    value={values.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                  >
                    {EDUCATION_LEVELS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Filed a tax return last year?</InputLabel>
                  <Select
                    label="Filed a tax return last year?"
                    value={values.filedTaxes}
                    onChange={(e) => handleChange('filedTaxes', e.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* --- Current benefits --- */}
              <Grid size={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    What benefits are you currently on?
                  </FormLabel>
                  <FormGroup>
                    <Grid container>
                      {BENEFIT_OPTIONS.map((benefit) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={benefit}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.currentBenefits.includes(
                                  benefit,
                                )}
                                onChange={() => toggleBenefit(benefit)}
                              />
                            }
                            label={benefit}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </FormControl>
              </Grid>

              {/* --- Submit --- */}
              <Grid size={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  {submitLabel}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {onBack && (
          <Button onClick={onBack} sx={{ mt: 3 }}>
            ← Back to dashboard
          </Button>
        )}
      </Container>
    </Box>
  )
}
