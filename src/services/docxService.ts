import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } from 'docx';
import { EventPlan } from '../types/eventTypes';
import { getMenuItemById } from './menuService';

export class DOCXService {
  static async generateEventDOCX(eventPlan: EventPlan, language: 'en' | 'ta'): Promise<void> {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              text: language === 'en' ? 'BKR Catering – Event Menu' : 'BKR கேட்டரிங் – நிகழ்வு மெனு',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Client Information
            new Paragraph({
              text: language === 'en' ? 'Client Information' : 'வாடிக்கையாளர் தகவல்',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Name: ' : 'பெயர்: ',
                  bold: true
                }),
                new TextRun(eventPlan.clientDetails.name || '')
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Phone: ' : 'தொலைபேசி: ',
                  bold: true
                }),
                new TextRun(eventPlan.clientDetails.phone || '')
              ],
              spacing: { after: 100 }
            }),

            // Venue Information
            new Paragraph({
              text: language === 'en' ? 'Venue Information' : 'இட தகவல்',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Venue: ' : 'இடம்: ',
                  bold: true
                }),
                new TextRun(eventPlan.venueDetails.name || '')
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Address: ' : 'முகவரி: ',
                  bold: true
                }),
                new TextRun(eventPlan.venueDetails.address || '')
              ],
              spacing: { after: 100 }
            }),

            // Event Dates
            new Paragraph({
              text: language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Start Date: ' : 'தொடக்க தேதி: ',
                  bold: true
                }),
                new TextRun(eventPlan.eventDates.startDate || '')
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'End Date: ' : 'முடிவு தேதி: ',
                  bold: true
                }),
                new TextRun(eventPlan.eventDates.endDate || '')
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Duration: ' : 'காலம்: ',
                  bold: true
                }),
                new TextRun(`${eventPlan.eventDates.numberOfDays} ${language === 'en' ? 'days' : 'நாட்கள்'}`)
              ],
              spacing: { after: 200 }
            }),

            // Event Summary
            new Paragraph({
              text: language === 'en' ? 'Event Summary' : 'நிகழ்வு சுருக்கம்',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Total Sessions: ' : 'மொத்த அமர்வுகள்: ',
                  bold: true
                }),
                new TextRun(eventPlan.totalSessions.toString())
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: language === 'en' ? 'Total Headcount: ' : 'மொத்த தலை எண்ணிக்கை: ',
                  bold: true
                }),
                new TextRun(eventPlan.totalHeadCount.toString())
              ],
              spacing: { after: 200 }
            }),

            // Menu Details by Day
            ...this.generateDaySections(eventPlan, language)
          ]
        }]
      });

      // Save the document
      const blob = await Packer.toBlob(doc);
      const fileName = `BKR-Catering-Event-${eventPlan.clientDetails.name}-${language === 'en' ? 'EN' : 'TA'}-${new Date().toISOString().split('T')[0]}.docx`;
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating DOCX:', error);
      throw new Error(language === 'en' ? 'Error generating DOCX' : 'DOCX உருவாக்குவதில் பிழை');
    }
  }

  private static generateDaySections(eventPlan: EventPlan, language: 'en' | 'ta') {
    const sections: Paragraph[] = [];

    eventPlan.days.forEach((day, dayIndex) => {
      // Day Header
      sections.push(
        new Paragraph({
          text: `${language === 'en' ? 'DAY' : 'நாள்'} ${day.dayNumber} - ${day.date}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        })
      );

      // Sessions for this day
      day.sessions.forEach((session, sessionIndex) => {
        // Session Header
        sections.push(
          new Paragraph({
            text: language === 'en' ? session.sessionName : session.sessionNameTa,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 150 }
          })
        );

        // Session Details
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: language === 'en' ? 'Time: ' : 'நேரம்: ',
                bold: true
              }),
              new TextRun(`${session.timeRange.startTime} - ${session.timeRange.endTime}`)
            ],
            spacing: { after: 100 }
          })
        );

        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: language === 'en' ? 'Headcount: ' : 'தலை எண்ணிக்கை: ',
                bold: true
              }),
              new TextRun(session.headCount.toString())
            ],
            spacing: { after: 150 }
          })
        );

        // Menu Items Table
        if (session.selectedItems.length > 0) {
          const table = this.createMenuItemsTable(session.selectedItems, language);
          sections.push(table);
          sections.push(
            new Paragraph({
              text: '',
              spacing: { after: 200 }
            })
          );
        }

        // Add separator between sessions (except for the last session)
        if (sessionIndex < day.sessions.length - 1) {
          sections.push(
            new Paragraph({
              text: '─'.repeat(50),
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 200 }
            })
          );
        }
      });

      // Add separator between days (except for the last day)
      if (dayIndex < eventPlan.days.length - 1) {
        sections.push(
          new Paragraph({
            text: '═'.repeat(50),
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 300 }
          })
        );
      }
    });

    return sections;
  }

  private static createMenuItemsTable(selectedItems: string[], language: 'en' | 'ta') {
    const rows: TableRow[] = [];

    // Header row
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: language === 'en' ? 'Item Name' : 'பொருள் பெயர்',
                children: [new TextRun({ bold: true })]
              })
            ],
            width: { size: 70, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' }
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: language === 'en' ? 'Category' : 'வகை',
                children: [new TextRun({ bold: true })]
              })
            ],
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' }
          })
        ]
      })
    );

    // Data rows
    selectedItems.forEach(itemId => {
      const menuItem = getMenuItemById(itemId);
      if (menuItem) {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun(language === 'en' ? menuItem.name_en : menuItem.name_ta),
                      ...(language === 'ta' ? [new TextRun({ text: ` (${menuItem.name_en})`, size: 20 })] : [])
                    ]
                  })
                ],
                width: { size: 70, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: menuItem.category
                  })
                ],
                width: { size: 30, type: WidthType.PERCENTAGE }
              })
            ]
          })
        );
      }
    });

    return new Table({
      rows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 }
      }
    });
  }
}
