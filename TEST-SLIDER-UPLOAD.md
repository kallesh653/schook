# Slider Upload Test Plan

## Current Implementation Check

### Frontend Flow:
1. ✅ FrontPageManagement loads slides from `/public-home/data`
2. ✅ Displays slides in grid with edit/delete buttons
3. ✅ Opens SliderDialog when "Add Slide" clicked
4. ✅ SliderDialog handles file upload with compression
5. ✅ Saves slide data via `handleSaveSlide` to `/public-home/slider`
6. ✅ SimpleHome reads from `/public-home/data` and displays slides

### API Endpoints:
- ✅ GET `/public-home/data` - Returns all home page data including slider
- ✅ PATCH `/public-home/slider` - Updates slider with new slides array

### Data Structure:
```javascript
{
  slider: {
    showSlider: true,
    slides: [
      {
        id: "unique-id",
        type: "image" | "video",
        url: "data:image/jpeg;base64,..." or "https://...",
        title: "Optional Title",
        description: "Optional Description",
        active: true,
        order: 0
      }
    ]
  }
}
```

## Potential Issues:

### Issue 1: SliderDialog Image Compression
**Problem**: The `compressImage` function might be throwing errors during:
- FileReader.readAsDataURL()
- Image.onload()
- canvas.toBlob()
- FileReader.readAsDataURL() on blob

**Fix Applied**: Added comprehensive error handling at each step with clear error messages

### Issue 2: Base64 Size
**Problem**: Large base64 strings might exceed MongoDB document size limit (16MB)
**Solution**: Compress images aggressively, warn user if too large

### Issue 3: Browser Memory
**Problem**: Loading large images in browser can cause memory issues
**Solution**: Limit to 10MB input files, compress to smaller size

## Test Steps:

1. **Login to Admin Panel**: https://www.schoolm.gentime.in/school/login
2. **Navigate to Home Page Management**: /school/home-page-management
3. **Click "Hero Slider" tab**
4. **Click "Add Slide" button**
5. **Upload Test Images**:
   - Small image (< 1MB) - Should work
   - Medium image (2-5MB) - Should compress and work
   - Large image (5-10MB) - Should compress aggressively
   - Very large image (> 10MB) - Should show error
6. **Check Console Logs**:
   - Look for upload progress messages
   - Check for compression logs
   - Check for API response
7. **Verify on Home Page**: /home
   - Should see new slide in slider
   - Should auto-advance every 5 seconds
   - Should have navigation arrows

## Expected Behavior:

### Success Case:
1. Upload button shows "Processing..."
2. Console logs show compression steps
3. Success message: "✅ Upload complete!"
4. Preview shows the image
5. "Add Slide" button becomes enabled
6. Clicking "Add Slide" saves to API
7. Slide appears in management grid
8. Slide appears on home page

### Error Case:
1. Error alert shows at top of dialog
2. Console shows error details
3. User sees helpful error message
4. Can try again with different image

## Debugging Commands:

```bash
# Check MongoDB slider data
ssh root@72.60.202.218 "mongo schoolm --eval 'db.publichomepages.findOne({}, {slider: 1})'"

# Check API logs
ssh root@72.60.202.218 "pm2 logs schoolm-api --lines 50"

# Check if slides are saved
curl https://api.gentime.in/api/public-home/data | jq '.data.slider'
```
