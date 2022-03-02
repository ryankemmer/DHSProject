# Basic program to show image, zoomed image and determine attention paid to every image region
# Programmed by Olac Fuentes
# Last modified August 17, 2021

import numpy as np
import matplotlib.pyplot as plt

def display_images(r,c):
    r = int(r+0.5)
    c = int(c+0.5)
    r0 = max(r-dr,0)
    c0 = max(c-dc,0)
    r0 = min(r0,im.shape[0]-2*dr)
    c0 = min(c0,im.shape[1]-2*dc)
    if type(im[0,0,0])==np.uint8: # Make sure it works with float and unsigned integer images
        im_copy[r0:r0+2*dr,c0:c0+2*dc] = 3*(im[r0:r0+2*dr,c0:c0+2*dc]//4)+63
    else:
        im_copy[r0:r0+2*dr,c0:c0+2*dc] = 0.85*im[r0:r0+2*dr,c0:c0+2*dc]
    img.set_data(im_copy)
    im_copy[r0:r0+2*dr,c0:c0+2*dc] = im[r0:r0+2*dr,c0:c0+2*dc]
    attention[r0:r0+2*dr,c0:c0+2*dc] += att_mask # Increment attention counter
    zoom.set_data(im[r0:r0+2*dr,c0:c0+2*dc])
    plt.pause(.001)
    plt.draw()

def on_mouse_move(event):
    # Detect mouse movement and, if valid, display new zoomed image
    if event.ydata != None and event.xdata!=None:
        display_images(event.ydata, event.xdata)

def on_mouse_click(event):
    # Terminate mouse monitoring and display attention
    plt.disconnect(notify_mouse)
    plt.disconnect(notify_mouse_click)
    img.set_data(im)
    plt.pause(.001)
    plt.draw()
    plt.figure()
    plt.imshow(attention)
    plt.title('Attention map')
    plt.tight_layout()
    plt.axis('off')

im = plt.imread('/Users/harikabhogaraju/DHSProject/dataOps/sample_1_z.png')
if len(im.shape) == 4: # Remove transparency channel
    im = im[:,:,:-1]

im_copy = np.copy(im)

im_frac = 10
dr,dc =  im.shape[0]//im_frac,im.shape[1]//im_frac # Zoomed area will be 2*dr-by-2*dc - this can be tweaked
# Set attention weights; highest at the center of zoomed area. Decay constant can be tweaked
r = (np.arange(2*dr)-dr)**2
c = (np.arange(2*dc)-dc)**2
rr, cc = np.meshgrid(r, c)
att_mask = np.exp(-(10**-3.8)*(rr+cc)).T

# Initialize attention accumulator
attention = np.zeros((im.shape[0],im.shape[1]))

# Determine figure size to preserve original image aspect ratio
fig_vert_size = 6
fig_hor_size = int(2*fig_vert_size*im.shape[1]/im.shape[0]+0.5)
plt.close('all')
fig, ax = plt.subplots(1,2,figsize=(fig_hor_size,fig_vert_size))
plt.tight_layout()
img = ax[0].imshow(im)
ax[0].axis('off')
ax[1].axis('off')
zoom = ax[1].imshow(np.ones_like(im))

# Start mouse monitoring processes
# Moving the mouse inside the right size of the figure will change the region to zoom
# Clicking on the mouse terminates monitoring and displays the attention map
notify_mouse = plt.connect('motion_notify_event', on_mouse_move)
notify_mouse_click = plt.connect('button_press_event', on_mouse_click)
